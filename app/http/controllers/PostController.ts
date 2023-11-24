import { Controller } from "@/lib/http/Controller";

export class PostController extends Controller {}

// abstract class Model {
//   static register = <T extends Policy<any>>(policy: T): T => {
//     return policy;
//   };
// }

// abstract class Policy<T extends Model> {
//   abstract u;
// }

// class CategoryPolicy extends Policy {}

// class PostPolicy extends Policy<Post> {
//   update = (post: Model) => {
//     return Auth.user().id === post.userId;
//   };
// }

// class Post extends Model {
//   constructor(public userId: string) {
//     super();
//   }
// }

// class ServiceProvider {
//   policies: Policy[] = [];

//   init = () => {
//     return this.policies;
//   };
// }

// type PolicyResponse = boolean;

// function createPolicy<T extends Model>(
//   model: T,
//   methods: Record<string, (instance: InstanceType<T>) => PolicyResponse>,
// ) {}

// const postPolicy = createPolicy(Post, {
//   update: (post) => {
//     return post.userId === "1234";
//   },
// });

// class AuthServiceProvider extends ServiceProvider {
//   override policies = [Post.register(PostPolicy)];
// }

// const x = new AuthServiceProvider();
